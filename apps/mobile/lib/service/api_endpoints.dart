class ApiEndpoints {
  // Auth-Service
  static const String authBase = 'http://localhost:3000';
  static String register() => '$authBase/register';
  static String login() => '$authBase/login';

  // User-Service
  static const String userBase = 'http://localhost:3002';
  static String createProfile() => '$userBase/api/users/profile';
  static String updateBio() => '$userBase/api/users/profile/bio';
  static String updateAvatar() => '$userBase/api/users/profile/avatar';
  static String increaseFollowers() => '$userBase/api/users/profile/followers/increase';
  static String decreaseFollowers() => '$userBase/api/users/profile/followers/decrease';

  // Event-Service
  static const String eventBase = 'http://localhost:3334';
  static String events() => '$eventBase/api/events';
  static String eventNearby() => '$eventBase/api/events/nearby';
  static String eventDetail(String id) => '$eventBase/api/events/$id';

  // Establishment-Service
  static const String establishmentBase = 'http://localhost:3002';
  static String establishments() => '$establishmentBase/establishments';
}