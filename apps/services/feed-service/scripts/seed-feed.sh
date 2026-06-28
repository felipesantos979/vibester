#!/usr/bin/env bash
# Seed script: populates feed via Kafka events
# Usage: ./scripts/seed-feed.sh <follower-user-id> <followed-user-id>
#
# Flow:
#   1. Publishes user.followed -> feed-service records the follow in Cassandra
#   2. Publishes post.created  -> feed-service distributes the post to followers
#   3. GET /feed/<follower-user-id> should return the post

set -euo pipefail

FOLLOWER_ID="${1:-04eab9d8-2b83-4049-bb24-b853855d9a0e}"
FOLLOWED_ID="${2:-6361e54c-f028-4d3d-85b7-2f19d935171e}"
KAFKA_POD="${KAFKA_POD:-kafka-0}"
NAMESPACE="${NAMESPACE:-default}"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
POST_ID=$(cat /proc/sys/kernel/random/uuid)
EVENT_ID_1=$(cat /proc/sys/kernel/random/uuid)
EVENT_ID_2=$(cat /proc/sys/kernel/random/uuid)

echo "================================================"
echo "Vibester Feed Seed"
echo "================================================"
echo "Follower (will see the post): $FOLLOWER_ID"
echo "Followed (post author):       $FOLLOWED_ID"
echo "Post ID:                      $POST_ID"
echo "Kafka pod:                    $KAFKA_POD ($NAMESPACE)"
echo ""

# ── Step 1: user.followed ────────────────────────────────────────────────────
FOLLOW_EVENT=$(cat <<EOF
{"eventId":"$EVENT_ID_1","eventType":"user.followed","occurredAt":"$NOW","data":{"followerId":"$FOLLOWER_ID","followedId":"$FOLLOWED_ID"}}
EOF
)

echo "→ [1/2] Publishing user.followed to topic 'users'..."
echo "$FOLLOW_EVENT" | kubectl exec -i -n "$NAMESPACE" "$KAFKA_POD" -- \
  /opt/kafka/bin/kafka-console-producer.sh \
    --bootstrap-server localhost:9092 \
    --topic users
echo "   Done."

# Give the consumer a moment to process the follow
sleep 2

# ── Step 2: post.created ─────────────────────────────────────────────────────
POST_EVENT=$(cat <<EOF
{"eventId":"$EVENT_ID_2","eventType":"post.created","occurredAt":"$NOW","data":{"itemId":"$POST_ID","itemType":"USER_POST","authorId":"$FOLLOWED_ID","authorUsername":"seed_user","authorProfilePicture":"https://i.pravatar.cc/150?u=$FOLLOWED_ID","authorVerified":false,"content":"Post de teste criado pelo seed script ✓","imageUrls":[],"tags":["seed","test"],"totalLikes":0,"totalComments":0,"isSponsored":false,"isDeleted":false,"createdAt":"$NOW"}}
EOF
)

echo "→ [2/2] Publishing post.created to topic 'posts'..."
echo "$POST_EVENT" | kubectl exec -i -n "$NAMESPACE" "$KAFKA_POD" -- \
  /opt/kafka/bin/kafka-console-producer.sh \
    --bootstrap-server localhost:9092 \
    --topic posts
echo "   Done."

echo ""
echo "✓ Events published. Waiting 3s for feed-service to process..."
sleep 3

# ── Step 3: Verify ───────────────────────────────────────────────────────────
echo ""
echo "→ [3/3] Checking feed for follower ($FOLLOWER_ID)..."
echo ""

# Detect if port 3006 is already forwarded; if not, start one temporarily
PORT_FORWARD_PID=""
if ! curl -s --connect-timeout 1 http://localhost:3006/health > /dev/null 2>&1; then
  kubectl port-forward -n "$NAMESPACE" \
    "$(kubectl get pod -n "$NAMESPACE" -l app=feed-service -o jsonpath='{.items[0].metadata.name}')" \
    3006:3006 &
  PORT_FORWARD_PID=$!
  sleep 2
fi

RESPONSE=$(curl -s "http://localhost:3006/feed/$FOLLOWER_ID")
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

ITEM_COUNT=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d.get('items',[])))" 2>/dev/null || echo "?")
echo ""
if [ "$ITEM_COUNT" -gt 0 ] 2>/dev/null; then
  echo "✓ Feed has $ITEM_COUNT item(s) — seed successful!"
else
  echo "⚠  Feed still empty. The consumer may still be processing. Re-run:"
  echo "   curl -s http://localhost:3006/feed/$FOLLOWER_ID | python3 -m json.tool"
fi

[ -n "$PORT_FORWARD_PID" ] && kill "$PORT_FORWARD_PID" 2>/dev/null || true
