import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryDto } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';

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
}
