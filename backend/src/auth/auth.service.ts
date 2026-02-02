import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { updatebanAuthdto } from './dto/update-banAUth.dto';

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
    if(existing.isBanned){
      throw new HttpException('This account is banned ,Contact admin',403)
    }
    return {message:'already existed',user:existing}

  }

  async login(createAuthDto: CreateAuthDto){
    const {email}= createAuthDto
    const existing = await this.userRepo.findOne({where:{email}})
    console.log(existing)
    if (!existing){
       throw new HttpException('User Not Existed',404)
    }
    if(existing.isBanned){
      console.log('this block work')
      throw new HttpException('This account is banned ,Contact admin',403)
    }
    return existing

  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: string, updateAuthDto: updatebanAuthdto) {
    const {isBanned} = updateAuthDto
    const res = await this.userRepo.update(id,{isBanned})
    return {message:'succesfully update the ban'};
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
