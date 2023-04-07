import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto, PersistArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { IArticlesResponse } from './types/articlesResponse.interface';
import appDataSource from '@app/ormconfig';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
    const queryBuilder = appDataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');
    queryBuilder.orderBy('articles.createdAt', 'DESC');
    if (query.limit) queryBuilder.limit(query.limit);
    if (query.offset) queryBuilder.offset(query.offset);
    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }
    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();
    return { articles, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return this.articleRepository.save(article);
  }

  async findBydSlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async deleteArticle(slug: string, userId: number): Promise<DeleteResult> {
    const article = await this.findBydSlug(slug);
    if (article) {
      if (article.author.id === userId)
        return await this.articleRepository.delete({ slug });
      else
        throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    } else
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
  }

  async updateArticle(
    slug: string,
    updateArticleDto: PersistArticleDto,
    userId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBydSlug(slug);
    if (article) {
      if (article.author.id === userId) {
        Object.assign(article, updateArticleDto);
        return this.articleRepository.save(article);
      } else
        throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    } else
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
