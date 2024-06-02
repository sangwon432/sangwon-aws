import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.createBlog(createBlogDto);
  }

  @Get('all')
  async getBlogs() {
    return await this.blogService.getBlogData();
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
}
