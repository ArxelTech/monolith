import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { loginDTO } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordDto } from './dto/resetpassword.Dto';
import { VerifyEmailDTO } from './dto/verifyemail.dto';
import { ResendEmailVerificationDTO } from './dto/resend.dto';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Post('auth/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBody({ type: loginDTO })
  @Post('auth/login')
  login(@Body() loginDto: loginDTO) {
    return this.userService.login(loginDto);
  }

  @ApiBody({ type: ResetPasswordDto })
  @Post('auth/passwordreset')
  requestpasswordrreset(@Body() loginDto: ResetPasswordDto) {
    return this.userService.sendResetLink(loginDto.email);
  }

  @ApiBody({ type: VerifyEmailDTO })
  @Post('auth/verifyemail')
  verifyemail(@Body() Dto: VerifyEmailDTO) {
    return this.userService.verifyEmail(Dto);
  }

  @ApiBody({ type: ResendEmailVerificationDTO })
  @Post('auth/resend/verification-code')
  verifyemailresend(@Body() Dto: ResendEmailVerificationDTO) {
    console.log(Dto);
    return this.userService.resendCode(Dto.email);
  }

  @ApiBody({ type: UpdateUserDto })
  @Put(':id')
  updateUser(@Body() updateDto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, updateDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', { dest: 'public/avatars' }))
  @Put('avatar/:userId')
  updateUserProfile(
    @Param('userId') userId: string,
    @UploadedFile() file: any,
  ) {
    return this.userService.uploadFile(userId, file);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
