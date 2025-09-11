import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { DocItemService } from './doc-item.service';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

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
}
