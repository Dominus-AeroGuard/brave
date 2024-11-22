import { ApiProperty } from '@nestjs/swagger';

export class AuthInfoResponse {
  @ApiProperty({
    description: 'Token JWT para autorização ao backend',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMiwib3JnSWQiOjEsInJvbGVzIjpbImFkbWluIl0sInBlcm1pc3Npb25zIjpbImFwcGxpY2F0aW9uOndyaXRlIiwiYXBwbGljYXRpb246Y3JlYXRlIiwiYXBwbGljYXRpb246dXBkYXRlIiwiYXBwbGljYXRpb246ZGVsZXRlIl19.1mW_VsqwI1YePJsb-FnNdz-kJO2gmMfXJ_Ra6RMTvXU',
  })
  acces_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Id do usuário que gerou o token',
    example: 123,
  })
  userId: bigint;

  @ApiProperty({
    description: 'Organizações que o usuário está vinculado',
    example: [1, 2],
  })
  organizations: Array<bigint>;

  @ApiProperty({
    description: 'Papeis que podem ser executados na aplicação',
    example: ['admin'],
  })
  roles: Array<string>;

  @ApiProperty({
    description:
      'Permissões atribuídas ao usuário, podem ser atribuidas pelo vinculo de uma role ou diretamente a um permissão',
    example: ['application:read'],
  })
  permissions: Array<string>;
}
