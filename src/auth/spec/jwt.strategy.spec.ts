import { JwtStrategy } from '../jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../common/constants';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUser';
      user.role = UserRole.AUTHORED_USER;

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'TestUser', role: UserRole.AUTHORED_USER });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'TestUser', role: UserRole.AUTHORED_USER })).rejects.toThrow(UnauthorizedException);
    });
  });
});
