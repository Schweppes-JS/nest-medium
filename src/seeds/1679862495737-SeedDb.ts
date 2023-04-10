import { QueryRunner } from 'typeorm';

export class SeedDb1679862495737 {
  name = 'SeedDb1679862495737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('dinos')`,
    );

    await queryRunner.query(
      // password is 'test3'
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$VORba7f79O6UGsmSYBAFreRv3mJ.G4C8WOZ7eD05b3aRG7bVmZGVC')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article-slug', 'first-article-title', 'first-article-description', 'first-article-body', 'dragons,coffee', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article-slug', 'second-article-title', 'second-article-description', 'second-article-body', 'dragons,coffee', 1)`,
    );
  }
}
