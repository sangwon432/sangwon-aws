import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';

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

  async getBlogData(pageOptionsDto: PageOptionsDto): Promise<PageDto<Blog>> {
    // const blogs = await this.blogRepository.find();
    // return blogs;

    const queryBuilder = this.blogRepository.createQueryBuilder('blog');
    queryBuilder
      // .leftJoinAndSelect('user.consent', 'consent')
      // .leftJoinAndSelect('user.profile', 'profile')
      // .leftJoinAndSelect('user.jobInfo', 'job')
      // .leftJoinAndSelect('user.educationInfo', 'education')
      // .leftJoinAndSelect('user.religionInfo', 'religion')
      // .leftJoinAndSelect('user.marriageInfo', 'marriage')
      .orderBy('blog.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    // const queryBuilder = this.blogRepository.createQueryBuilder('blog');
    // queryBuilder
    //   .orderBy('blog.createdAt', pageOptionsDto.order)
    //   .skip(pageOptionsDto.skip)
    //   .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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
