import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocItemService } from './doc-item.service';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';
import { DocItemDTO } from './dto';
import { IdParamDTO } from 'src/location/dto';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('doc-item')
export class DocItemController {
  constructor(private docItemService: DocItemService) {}

  @Get(':name')
  fetchAllDocItem(@Param() param: CategoryParamDTO, @Req() req: Request) {
    return this.docItemService.fetchDocItems(param, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('admin/all')
  gettingAllDocuments(@Query() query: any) {
    return this.docItemService.adminFetchAllArticle(query);
  }

  @Get('user/all')
  fetchAllCategories(@Req() req: Request) {
    return this.docItemService.fetchAllArticle(req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  addDocItem(@Body() dto: DocItemDTO, @Req() req: Request) {
    return this.docItemService.createDocItem(dto, req.user);
  }

  @Patch(':id')
  updateDocItem(@Body() dto: DocItemDTO, @Param() param: IdParamDTO) {
    return this.docItemService.updateDocItem(dto, param);
  }
}
