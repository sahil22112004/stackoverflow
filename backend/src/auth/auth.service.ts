import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const {email,username}= createAuthDto
    console.log("serv",createAuthDto)

    const existing = await this.userRepo.findOne({where:{email}})
    console.log("existing",existing)
    if (!existing){
      const newUser = this.userRepo.create(createAuthDto);
      await this.userRepo.save(newUser);
      return {message:'register succesfully',user:newUser} 
    }
    return {message:'already existed',user:existing}

  }

  async login(createAuthDto: CreateAuthDto){
    const {email}= createAuthDto
    const existing = await this.userRepo.findOne({where:{email}})
    if (!existing){
       throw new HttpException('User Not Existed',404)
    }
    return existing

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
