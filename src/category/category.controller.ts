import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryDto, PlaceItemDTO, SubCategoryDTO } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  fetchCategories() {
    return this.categoryService.fetchAllCategories();
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
  fetchAllPlaceItems(@Param() param: CategoryParamDTO) {
    return this.categoryService.getSubCategoryItems(param);
  }

  @Post('placeitem')
  addPlaceItem(@Body() dto: PlaceItemDTO) {
    return this.categoryService.createPlaceItem(dto);
  }
}
