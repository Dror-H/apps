import 'dart:io';

import 'package:chopper/chopper.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:instigo_mobile/api/result.dart';
import 'package:instigo_mobile/model/user.dart';

import 'model-convertor.dart';

part 'user-service.chopper.dart';

@ChopperApi()
abstract class UserService extends ChopperService {
  @Get(path: 'me')
  Future<Response<Result<User>>> getMe();

  static UserService create() {
    final client = ChopperClient(
      baseUrl: '${dotenv.env['BACKEND_URL']}/server',
      interceptors: [_addHeaders, HttpLoggingInterceptor()],
      converter: ModelConverter(),
      errorConverter: const JsonConverter(),
      services: [
        _$UserService(),
      ],
    );
    return _$UserService(client);
  }
}

Future<Request> _addHeaders(Request req) async {
  final storage = FlutterSecureStorage();
  String jwt = await storage.read(key: 'jwt') ?? '';
  var headers = {
    HttpHeaders.authorizationHeader: 'Bearer $jwt',
    HttpHeaders.contentTypeHeader: 'application/json',
  };

  return req.copyWith(headers: headers);
}
