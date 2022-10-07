import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async createUniqueAddress(data: CreateAddressDto) {
        const user = await this.userRepository.findUserById(data.id);
        if (!user) throw new HttpException({ message: 'User with userid is no exist' }, HttpStatus.NOT_FOUND);


    }
}
