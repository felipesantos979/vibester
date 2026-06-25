class ApiEndpoints {
  static const String baseUrl = 'api.vibester.com.br';

  // Auth
  static String register() => '$baseUrl/register';
  static String login() => '$baseUrl/login';

  // User
  static String createProfile() => '$baseUrl/api/users/profile';
  static String updateBio() => '$baseUrl/api/users/profile/bio';
  static String updateAvatar() => '$baseUrl/api/users/profile/avatar';
  static String increaseFollowers() =>
      '$baseUrl/api/users/profile/followers/increase';
  static String decreaseFollowers() =>
      '$baseUrl/api/users/profile/followers/decrease';

  // Events
  static String events() => '$baseUrl/api/events';
  static String eventNearby() => '$baseUrl/api/events/nearby';
  static String eventDetail(String eventId) => '$baseUrl/api/events/$eventId';

  // Establishments
  static String establishments() => '$baseUrl/establishments';
  static String establishmentDetail(String establishmentId) =>
      '$baseUrl/establishments/$establishmentId';
  static String openEstablishments() => '$baseUrl/establishments/open';
  static String rateEstablishment(String establishmentId) =>
      '$baseUrl/establishments/$establishmentId/rating';
}