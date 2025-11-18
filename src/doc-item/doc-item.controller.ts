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
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('doc-item')
export class DocItemController {
  constructor(private docItemService: DocItemService) {}

  @Get(':name')
  fetchAllDocItem(
    @Param() param: CategoryParamDTO,
    @Req() req: Request,
    @Query() query: any,
  ) {
    return this.docItemService.fetchDocItems(param, req.user, query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('admin/all')
  gettingAllDocuments(@Query() query: any) {
    return this.docItemService.adminFetchAllArticle(query);
  }

  @Get('user/all')
  fetchAllCategories(@Req() req: Request, @Query() query: any) {
    return this.docItemService.fetchAllArticle(req.user, query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  addDocItem(
    @Body() dto: DocItemDTO,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.docItemService.createDocItem(dto, req.user, file);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateDocItem(
    @Body() dto: DocItemDTO,
    @Param() param: IdParamDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.docItemService.updateDocItem(dto, param, file);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Delete(':id')
  deleteDocItem(@Param() param: IdParamDTO) {
    return this.docItemService.deleteDocItem(param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('search/all')
  searchUser(@Query() query: any) {
    return this.docItemService.search(query);
  }

  @Get('user/search/all')
  userSearchAll(@Query() query: any, @Req() req: Request) {
    return this.docItemService.userSearchAll(query, req.user);
  }
}
