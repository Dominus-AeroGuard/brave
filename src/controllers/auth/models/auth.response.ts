import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'Token JWT para autorização ao backend',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMiwib3JnSWQiOjEsInJvbGVzIjpbImFkbWluIl0sInBlcm1pc3Npb25zIjpbImFwcGxpY2F0aW9uOndyaXRlIiwiYXBwbGljYXRpb246Y3JlYXRlIiwiYXBwbGljYXRpb246dXBkYXRlIiwiYXBwbGljYXRpb246ZGVsZXRlIl19.1mW_VsqwI1YePJsb-FnNdz-kJO2gmMfXJ_Ra6RMTvXU',
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
  })
  token_type: string;
}
