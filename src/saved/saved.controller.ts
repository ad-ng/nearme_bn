import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SavedDTO } from './dto';

@ApiBearerAuth()
@Controller('saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get(':name')
  fetchSavedItemsInCategory(
    @Param() param: CategoryParamDTO,
    @Req() req: Request,
  ) {
    return this.savedService.fetchSavedInCategory(param, req.user);
  }

  @Post()
  saveAnItem(@Body() dto: SavedDTO, @Req() req: Request) {
    return this.savedService.saveItem(dto, req.user);
  }

  @Delete()
  unsaveItem(@Body() dto: SavedDTO, @Req() req: Request) {
    return this.savedService.unsaveItem(dto, req.user);
  }

  @Get('/count/:name')
  fetchTotalSavedItemsInCategory(
    @Param() param: CategoryParamDTO,
    @Req() req: Request,
  ) {
    return this.savedService.fetchTotalSavedInCategory(param, req.user);
  }

  @Get('categories/all')
  fetchCategories(@Req() req: Request) {
    return this.savedService.getCategoriesWithSavedCounts(req.user);
  }
}
