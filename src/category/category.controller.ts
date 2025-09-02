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
import { CategoryDto, DocItemDTO, PlaceItemDTO, SubCategoryDTO } from './dto';
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

  @Get('subcategory/:name')
  fetchAllPlaceItems(@Param() param: CategoryParamDTO, @Req() req: Request) {
    return this.categoryService.getSubCategoryItems(param, req);
  }

  @Post('placeitem')
  addPlaceItem(@Body() dto: PlaceItemDTO) {
    return this.categoryService.createPlaceItem(dto);
  }

  @Get('docitem/:name')
  fetchAllDocItem(@Param() param: CategoryParamDTO, @Req() req: Request) {
    return this.categoryService.fetchDocItems(param, req.user);
  }

  @Post('docitem')
  addDocItem(@Body() dto: DocItemDTO, @Req() req: Request) {
    return this.categoryService.createDocItem(dto, req.user);
  }

  @Get('/articles/all')
  fetchAllCategories(@Req() req: Request) {
    return this.categoryService.fetchAllArticle(req.user);
  }

  @Get('recommendation/all')
  fetchRecommendation(@Req() req: Request) {
    return this.categoryService.fetchRecommendedPlaces(req.user);
  }

  @Get('search/all')
  searchEveryThing(@Query('query') query: string, @Req() req: Request) {
    return this.categoryService.search(query, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('/adminfetchdocs/all')
  gettingAllDocuments(@Query() query: any) {
    return this.categoryService.adminFetchAllArticle(query);
  }
}
