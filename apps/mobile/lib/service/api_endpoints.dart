class ApiEndpoints {
  static const String baseUrl = 'https://api.vibester.com.br';

  // Auth
  static String register() => '$baseUrl/auth/register';
  static String login() => '$baseUrl/auth/login';

  // User
  static String createProfile() => '$baseUrl/api/users/profile';
  static String getProfileById(String id) => '$baseUrl/user/users/profile/$id';
  static String updateInfo() => '$baseUrl/user/users/profile/info';
  static String updateBio() => '$baseUrl/user/users/profile/bio';
  static String updateAvatar() => '$baseUrl/api/users/profile/avatar';
  static String increaseFollowers() =>
      '$baseUrl/api/users/profile/followers/increase';
  static String decreaseFollowers() =>
      '$baseUrl/api/users/profile/followers/decrease';

  // Events
  static String events() => '$baseUrl/event/events';
  static String eventNearby() => '$baseUrl/event/events/nearby';
  static String eventDetail(String eventId) => '$baseUrl/event/events/$eventId';

  // Establishments
  static String establishments() => '$baseUrl/establishment/establishments';
  static String establishmentsByCategory(String category) =>
      '$baseUrl/establishment/establishments?category=$category';
  static String establishmentDetail(String establishmentId) =>
      '$baseUrl/establishment/establishments/$establishmentId';
  static String openEstablishments() =>
      '$baseUrl/establishment/establishments/open';
  static String rateEstablishment(String establishmentId) =>
      '$baseUrl/establishment/establishments/$establishmentId/rating';

  // Payment
  static String checkout() => '$baseUrl/payment/checkout';
}