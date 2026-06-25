import 'dart:convert';
import 'package:mobile/models/user/user_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class UserService {
  UserModel decodeToken(String token) {
    final payload = token.split('.')[1];
    final decoded = utf8.decode(base64Url.decode(base64Url.normalize(payload)));
    final json = jsonDecode(decoded);
    return UserModel.fromJson(json);
  }

  Future<void> register({
    required String name,
    required String username,
    required String email,
    required String password,
    required String bornAt,
  }) async {
    await ApiClient.dio.post(
      ApiEndpoints.register(),
      data: {
        'name': name,
        'username': username,
        'email': email,
        'password': password,
        'bornAt': bornAt,
      },
    );
  }

  Future<String> login({
    required String email,
    required String password,
  }) async {
    final response = await ApiClient.dio.post(
      ApiEndpoints.login(),
      data: {
        'email': email,
        'password': password,
      },
    );

    return response.data['token'];
  }
}