import 'dart:io';
import 'package:dio/dio.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class UploadUrlResult {
  final String uploadUrl;
  final String key;
  final String publicUrl;

  UploadUrlResult({
    required this.uploadUrl,
    required this.key,
    required this.publicUrl,
  });

  factory UploadUrlResult.fromJson(Map<String, dynamic> json) {
    return UploadUrlResult(
      uploadUrl: json['uploadUrl'] ?? '',
      key: json['key'] ?? '',
      publicUrl: json['publicUrl'] ?? '',
    );
  }
}

class PostService {
  Future<List<UploadUrlResult>> _getUploadUrls({
    required String userId,
    required int count,
  }) async {
    try {
      final response = await ApiClient.dio.post(
        ApiEndpoints.postsUploadUrl(),
        data: {'userId': userId, 'count': count},
      );
      final List data = response.data;
      return data.map((json) => UploadUrlResult.fromJson(json)).toList();
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ?? 'Erro ao gerar URLs de upload';
      throw Exception(mensagem);
    }
  }

  Future<void> _uploadToR2(String uploadUrl, File file) async {
    final dio = Dio(); // instância separada: sem Authorization da sua API
    final bytes = await file.readAsBytes();
    final extensao = file.path.split('.').last.toLowerCase();
    final contentType = extensao == 'png' ? 'image/png' : 'image/jpeg';

    await dio.put(
      uploadUrl,
      data: bytes,
      options: Options(
        headers: {
          Headers.contentLengthHeader: bytes.length,
          'Content-Type': contentType,
        },
      ),
    );
  }

  Future<List<String>> _uploadImages({
    required String userId,
    required List<File> images,
  }) async {
    if (images.isEmpty) return [];

    final uploadUrls = await _getUploadUrls(
      userId: userId,
      count: images.length,
    );

    final publicUrls = <String>[];
    for (var i = 0; i < images.length; i++) {
      await _uploadToR2(uploadUrls[i].uploadUrl, images[i]);
      publicUrls.add(_normalizeUrl(uploadUrls[i].publicUrl));
    }
    return publicUrls;
  }

  String _normalizeUrl(String url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return 'https://$url';
  }

  Future<void> createPost({
    required String userId,
    required String userUsername,
    required String userProfilePicture,
    required bool userVerified,
    required String caption,
    required List<File> images,
    String? establishmentId,
    String? establishmentName,
    String? establishmentLogo,
    String? establishmentCategory,
  }) async {
    try {
      final imageUrls = await _uploadImages(userId: userId, images: images);

      await ApiClient.dio.post(
        ApiEndpoints.posts(),
        data: {
          'userId': userId,
          'userUsername': userUsername,
          'userProfilePicture': userProfilePicture,
          'userVerified': userVerified,
          'caption': caption,
          'imageUrls': imageUrls,
          if (establishmentId != null) 'establishmentId': establishmentId,
          if (establishmentName != null) 'establishmentName': establishmentName,
          if (establishmentLogo != null) 'establishmentLogo': establishmentLogo,
          if (establishmentCategory != null)
            'establishmentCategory': establishmentCategory,
        },
      );
    } on DioException catch (e) {
      final mensagem = e.response?.data?['message'] ?? 'Erro ao publicar post';
      throw Exception(mensagem);
    }
  }
}
