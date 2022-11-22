import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookDto } from './model';
import { User } from '../users/model';
import { UsersService } from '../users/users.service';


@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    private usersService: UsersService) {}

  async create(bookDto: BookDto): Promise<Book> {
    const book = new Book();
    book.title = bookDto.title;
    book.author = bookDto.author;
    book.description = bookDto.description;
    book.owner = await this.usersService.findOne(bookDto.ownerId);
    return this.booksRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  findOne(id: number): Promise<Book> {
    return this.booksRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }

  async update(id: number, bookDto: BookDto): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });
    if (book) {
      book.title = bookDto.title;
      book.author = bookDto.author;
      book.description = bookDto.description;
      book.owner = await this.usersService.findOne(bookDto.ownerId);
      return this.booksRepository.save(book);
    }
    return book;
  }

  async getOwner(id: number): Promise<User> {
    const book = await this.booksRepository.findOneBy({ id });
    if (book) {
      return book.owner;
    }
    return null;
  }
}
