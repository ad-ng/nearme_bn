import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryDto, DocItemDTO, SubCategoryDTO } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';
import { Request } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  fetchCategories(@Query() query: any) {
    return this.categoryService.fetchAllCategories(query);
  }

  @Post()
  addCategory(@Body() dto: CategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get(':name')
  fetchSubcategories(@Param() Param: CategoryParamDTO) {
    return this.categoryService.fetchSubcategories(Param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post('subcategory')
  addSubCategory(@Body() dto: SubCategoryDTO) {
    return this.categoryService.createSubCategories(dto);
  }

  @Post('docitem')
  addDocItem(@Body() dto: DocItemDTO, @Req() req: Request) {
    return this.categoryService.createDocItem(dto, req.user);
  }

  @Get('/articles/all')
  fetchAllCategories(@Req() req: Request) {
    return this.categoryService.fetchAllArticle(req.user);
  }

  @Get('search/all')
  searchEveryThing(@Query('query') query: string, @Req() req: Request) {
    return this.categoryService.search(query, req.user);
  }
}
