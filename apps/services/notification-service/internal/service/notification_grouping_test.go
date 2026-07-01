package service

import (
	"notification-service/internal/models"
	"testing"
	"time"
)

func row(typ, recipient, actor, refID, content string, read bool, createdAt time.Time) models.NotificationRow {
	return models.NotificationRow{
		ID:          actor + "-" + refID + "-" + createdAt.String(),
		Type:        typ,
		RecipientID: recipient,
		ActorID:     actor,
		RefID:       refID,
		Content:     content,
		Read:        read,
		CreatedAt:   createdAt,
	}
}

func TestGroupNotifications_LikesOnSamePostGroupTogether(t *testing.T) {
	now := time.Now()
	rows := []models.NotificationRow{
		row("like", "u1", "actorC", "post-1", "", false, now),
		row("like", "u1", "actorB", "post-1", "", false, now.Add(-time.Minute)),
		row("like", "u1", "actorA", "post-1", "", false, now.Add(-2*time.Minute)),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 1 {
		t.Fatalf("expected 1 group, got %d", len(groups))
	}
	g := groups[0]
	if g.ActorID != "actorC" {
		t.Errorf("expected headline actor to be the most recent (actorC), got %s", g.ActorID)
	}
	if g.TotalCount != 3 {
		t.Errorf("expected totalCount 3, got %d", g.TotalCount)
	}
	if g.OthersCount != 2 {
		t.Errorf("expected othersCount 2, got %d", g.OthersCount)
	}
	if g.Read {
		t.Error("expected group to be unread")
	}
}

func TestGroupNotifications_LikesAndCommentsOnSamePostAreSeparateGroups(t *testing.T) {
	now := time.Now()
	rows := []models.NotificationRow{
		row("like", "u1", "actorA", "post-1", "", false, now),
		row("comment", "u1", "actorB", "post-1", "legal!", false, now.Add(-time.Minute)),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 2 {
		t.Fatalf("expected 2 groups (like + comment), got %d", len(groups))
	}
	if groups[0].Type != "like" || groups[1].Type != "comment" {
		t.Errorf("expected order [like, comment], got [%s, %s]", groups[0].Type, groups[1].Type)
	}
}

func TestGroupNotifications_DuplicateActorCountsOnce(t *testing.T) {
	now := time.Now()
	rows := []models.NotificationRow{
		row("like", "u1", "actorA", "post-1", "", false, now),
		row("like", "u1", "actorA", "post-1", "", true, now.Add(-time.Hour)),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 1 {
		t.Fatalf("expected 1 group, got %d", len(groups))
	}
	if groups[0].TotalCount != 1 {
		t.Errorf("expected same actor to count once, got totalCount %d", groups[0].TotalCount)
	}
}

func TestGroupNotifications_GroupReadOnlyWhenAllRowsRead(t *testing.T) {
	now := time.Now()
	rows := []models.NotificationRow{
		row("like", "u1", "actorA", "post-1", "", true, now),
		row("like", "u1", "actorB", "post-1", "", false, now.Add(-time.Minute)),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 1 {
		t.Fatalf("expected 1 group, got %d", len(groups))
	}
	if groups[0].Read {
		t.Error("expected group to be unread since one underlying row is unread")
	}
}

func TestGroupNotifications_UnreadFollowsCollapseIntoOneGroupRegardlessOfDay(t *testing.T) {
	day1 := time.Date(2026, 6, 1, 10, 0, 0, 0, time.UTC)
	day2 := time.Date(2026, 6, 3, 10, 0, 0, 0, time.UTC)
	rows := []models.NotificationRow{
		row("follow", "u1", "actorA", "", "", false, day2),
		row("follow", "u1", "actorB", "", "", false, day1),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 1 {
		t.Fatalf("expected all unread follows to collapse into 1 group, got %d", len(groups))
	}
	if groups[0].TotalCount != 2 {
		t.Errorf("expected 2 distinct followers in the group, got %d", groups[0].TotalCount)
	}
}

func TestGroupNotifications_ReadFollowsBucketByCalendarDay(t *testing.T) {
	day1 := time.Date(2026, 6, 1, 10, 0, 0, 0, time.UTC)
	day2 := time.Date(2026, 6, 3, 10, 0, 0, 0, time.UTC)
	rows := []models.NotificationRow{
		row("follow", "u1", "actorA", "", "", true, day2),
		row("follow", "u1", "actorB", "", "", true, day1),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 2 {
		t.Fatalf("expected read follows on different days to form 2 groups, got %d", len(groups))
	}
	for _, g := range groups {
		if !g.Read {
			t.Error("expected read follow groups to be marked as read")
		}
	}
}

func TestGroupNotifications_ReadFollowsSameDayGroupTogether(t *testing.T) {
	base := time.Date(2026, 6, 1, 10, 0, 0, 0, time.UTC)
	rows := []models.NotificationRow{
		row("follow", "u1", "actorA", "", "", true, base.Add(2*time.Hour)),
		row("follow", "u1", "actorB", "", "", true, base),
	}

	groups := GroupNotifications(rows)

	if len(groups) != 1 {
		t.Fatalf("expected read follows on same calendar day to group together, got %d", len(groups))
	}
	if groups[0].TotalCount != 2 {
		t.Errorf("expected 2 distinct followers, got %d", groups[0].TotalCount)
	}
}

func TestGroupNotifications_EmptyInput(t *testing.T) {
	groups := GroupNotifications(nil)
	if len(groups) != 0 {
		t.Errorf("expected no groups for empty input, got %d", len(groups))
	}
}
