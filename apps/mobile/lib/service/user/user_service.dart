import 'package:mobile/models/user/user_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class UserService {
  //cria a conta e devolve o UserModel já com o id gerado pela API, em teoria ksksk
  Future<UserModel> register({
    required String name,
    required String username,
    required String email,
    required String password,
    required String bornAt,
  }) async {
    final response = await ApiClient.dio.post(
      ApiEndpoints.register(),
      data: {
        'name': name,
        'username': username,
        'email': email,
        'password': password,
        'bornAt': bornAt,
      },
    );

    return UserModel.fromJson(response.data);
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

    //confirmar o nome do campo do token na api dps
    return response.data['token'];
  }
}