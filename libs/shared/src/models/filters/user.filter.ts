import { UserDto } from '../dto/user.dto';
import { OrderFilter } from '../../interfaces/filters/order.filter';
import { PaginationFilter } from '../../interfaces/filters/pagination.filter';

export interface UserFilter extends OrderFilter<UserDto>, PaginationFilter {}
