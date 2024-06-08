import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    const newBlog = await this.blogRepository.create(createBlogDto);
    await this.blogRepository.save(newBlog);
    return newBlog;
  }

  async getBlogData() {
    const blogs = await this.blogRepository.find();
    return blogs;
  }

  async getBlogById(blogId: string) {
    const blog = await this.blogRepository.findOneBy({ id: blogId });
    if (blog) return blog;
    throw new HttpException('no blog', HttpStatus.NOT_FOUND);
  }

  async deleteBlogById(blogId: string) {
    const deleteResponse = await this.blogRepository.delete({ id: blogId });
    if (!deleteResponse.affected) {
      throw new HttpException('no blog', HttpStatus.NOT_FOUND);
    }
    return `deleted ${blogId}`;
  }

  async updateBlogById(id: string, updateBlogDto: CreateBlogDto) {
    await this.blogRepository.update(id, updateBlogDto);
    const updatedBlog = await this.blogRepository.findOneBy({ id });
    if (updatedBlog) return updatedBlog;
    throw new HttpException('no blog', HttpStatus.NOT_FOUND);
  }
}
