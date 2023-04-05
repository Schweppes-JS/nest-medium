import { Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly artcileService: ArticleService) {}
  @Post()
  async create() {
    return this.artcileService.createArticle();
  }
}
