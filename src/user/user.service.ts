import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from '@app/database';
import { genSalt, hash, compare } from 'bcrypt';
import { OtpService } from 'libs/OTP/src';
import { EmailService } from '@app/email';
import { loginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import Cloudinary from 'src/utils/cloudinary';
import { DeliveryType } from 'cloudinary';
import { VerifyEmailDTO } from './dto/verifyemail.dto';

@Injectable()
export class UserService {
  private types: DeliveryType = 'gravatar';
  constructor(
    private databaseService: DatabaseService,
    private otpService: OtpService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const user = await this.databaseService.user.findFirst({
      where: {
        email: createUserDto.email.toLowerCase(),
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }
    // hash password
    const password = await this.hashPassword(createUserDto.password);
    const newuser = await this.databaseService.user.create({
      data: {
        fullName: createUserDto.fullName,
        email: createUserDto.email.toLowerCase(),
        password,
      },
    });
    // send sign email
    await this.emailService.sendEmailVerificationOTP(newuser);

    // token
    // get token
    const token = await this.jwtService.signAsync(
      { email: newuser.email, password: newuser.password, id: newuser.id },
      { algorithm: 'HS256', expiresIn: `1d` },
    );

    // refresh token

    const refreshToken = await this.jwtService.signAsync(
      { email: newuser.email, password: newuser.password, id: newuser.id },
      { algorithm: 'HS256', expiresIn: `1m` },
    );
    delete newuser.password;
    return {
      message: 'User account created',
      data: {
        token,
        refreshToken,
        user: newuser,
      },
    };
  }

  async verifyEmail(payload: VerifyEmailDTO) {
    console.log(payload);
    const user = await this.databaseService.user.findFirst({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const valid = await this.otpService.verifyEmailOtp(payload.otp, user.id);
    if (!valid) {
      throw new BadRequestException('Invalid code');
    } else {
      await this.databaseService.user.update({
        where: { email: payload.email.toLowerCase() },
        data: { emailVerified: true },
      });
      return {
        message: 'Email verifed',
      };
    }
  }

  async resendCode(email: string) {
    const user = await this.databaseService.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    await this.emailService.sendEmailVerificationOTP(user);
    return {
      message: 'Code sent!',
    };
  }

  async login(payload: loginDTO) {
    const user = await this.databaseService.user.findFirst({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException('Account not found');
    }
    // check password

    const passwordMatch = await compare(payload.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    // get token
    const token = await this.jwtService.signAsync(
      { ...payload, id: user.id },
      { algorithm: 'HS256', expiresIn: `1d` },
    );

    // refresh token

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, id: user.id },
      { algorithm: 'HS256', expiresIn: `1m` },
    );
    delete user.password;
    return {
      message: 'Login successful',
      data: {
        user,
        accessToken: token,
        refreshToken,
      },
    };
  }

  async updateUser(id: string, payload: UpdateUserDto) {
    console.log(`this is the user id ${id}`);
    const user = await this.databaseService.user.findFirst({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (payload.username && user.username !== null) {
      delete payload.username;
    } else {
      // check if username has been taken
      const usernmaeInUser = await this.databaseService.user.findFirst({
        where: { username: payload.username },
      });

      if (usernmaeInUser) {
        throw new BadRequestException('Username taken');
      }
    }

    // update the details
    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });

    console.log(updatedUser);

    return {
      message: 'account updated',
    };
  }

  async uploadFile(userId: string, file: any) {
    console.log(file);
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // upload the image
    const fileUploadResponse = await Cloudinary.uploader.upload(file.path, {
      async: false,
      chunk_size: 500,
      folder: '/vently/avatars',
      // type: this.types,
      eager_async: true,
      transformation: { width: 250, height: 250 },
    });

    try {
      const url = fileUploadResponse.secure_url;

      await this.databaseService.user.update({
        where: { id: userId },
        data: { avatar: url },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }

    return {
      message: 'avatar updated',
    };
  }

  async sendResetLink(email: string) {
    console.log(email);
    const account = await this.databaseService.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!account) {
      throw new BadRequestException('User not found');
    }

    // send email
    await this.emailService.sendPasswordResetLink(account);
    return {
      message: 'Password reset link sent!',
    };
  }
}
