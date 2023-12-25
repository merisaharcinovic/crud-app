import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
    constructor(private userService:UsersService, private jwtService:JwtService){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.validateUser(email);
        if(!user) return null;
        const passwordCorrect = password === user.password;
        if(passwordCorrect){
            const {password: string, ...rest} = user;
            return rest;
        }
        return null;
    }

    login(userPayload: any) {
        const payload = { email: userPayload.email, id:userPayload.id, role: userPayload.role};
        return this.jwtService.sign(payload)
        
    }
}
