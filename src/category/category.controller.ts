import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryDto, SubCategoryDTO } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';
import { Request } from 'express';
import { IdParamDTO } from 'src/location/dto';

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

  @Patch(':id')
  updateCategory(@Body() dto: CategoryDto, @Param() param: IdParamDTO) {
    return this.categoryService.updateCategory(dto, param);
  }

  @Delete(':id')
  deleteCategory(@Param() param: IdParamDTO) {
    return this.categoryService.deleteCategory(param);
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

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Patch('subcategory/:id')
  updateSubCategory(@Body() dto: SubCategoryDTO, @Param() param: IdParamDTO) {
    return this.categoryService.updateSubCategories(dto, param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Delete('subcategory/:id')
  deleteSubCategory(@Param() param: IdParamDTO) {
    return this.categoryService.deleteSubCategory(param);
  }

  @Get('search/all')
  searchEveryThing(@Query('query') query: string, @Req() req: Request) {
    return this.categoryService.search(query, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('search/category/all')
  searchCategories(@Query('query') query: string) {
    return this.categoryService.searchCategories(query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('search/subcategory/all')
  searchSubCategories(@Query('query') query: string) {
    return this.categoryService.searchSubCategories(query);
  }
}
