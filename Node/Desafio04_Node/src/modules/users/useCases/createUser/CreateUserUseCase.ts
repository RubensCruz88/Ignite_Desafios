import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ email, name }: IRequest): User {
	const emailExiste = this.usersRepository.findByEmail(email);

	if(emailExiste){
		throw new Error("email já cadastrado");
	}

	const user = this.usersRepository.create({email, name});

	return user
}
}

export { CreateUserUseCase };
