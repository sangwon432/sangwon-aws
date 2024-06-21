import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { Blog } from './entities/blog.entity';

@Controller('blog')
@ApiTags('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.createBlog(createBlogDto);
  }

  //pagination
  @Get('all')
  async getBlogs(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Blog>> {
    return await this.blogService.getBlogData(pageOptionsDto);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogService.getBlogById(id);
  }

  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    return await this.blogService.deleteBlogById(id);
  }

  @Patch(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogDto,
  ) {
    return await this.blogService.updateBlogById(id, updateBlogDto);
  }

  ////PAGINATION
}
