import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto, PersistArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import { DeleteResult } from 'typeorm';

@Controller('articles')
export class ArticleController {
  constructor(private readonly artcileService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.artcileService.createArticle(
      user,
      createArticleDto,
    );
    return this.artcileService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingeArticle(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.artcileService.findBydSlug(slug);
    return this.artcileService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') id: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return await this.artcileService.deleteArticle(slug, id);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') id: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: PersistArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.artcileService.updateArticle(
      slug,
      updateArticleDto,
      id,
    );
    return this.artcileService.buildArticleResponse(article);
  }
}
