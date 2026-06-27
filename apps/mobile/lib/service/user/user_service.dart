import 'package:dio/dio.dart';
import 'package:email_validator/email_validator.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class UserService {
  Future<void> register({
    required String name,
    required String username,
    required String email,
    required String password,
    required String bornAt,
  }) async {
    try {
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
    } on DioException catch (e) {
      final mensagem = e.response?.data?['message'] ?? 'Erro ao criar conta';
      throw Exception(mensagem);
    }
  }

  Future<Map<String, dynamic>> login({
    required String emailOuUsername,
    required String password,
  }) async {
    final ehEmail = EmailValidator.validate(emailOuUsername);

    try {
      final response = await ApiClient.dio.post(
        ApiEndpoints.login(),
        data: {
          if (ehEmail) 'email': emailOuUsername else 'username': emailOuUsername,
          'password': password,
        },
      );

      return response.data;
    } on DioException catch (e) {
      final mensagem = e.response?.data?['message'] ?? 'Erro ao fazer login';
      throw Exception(mensagem);
    }
  }

  //Get de user
}