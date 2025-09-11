import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DocItemService } from './doc-item.service';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/auth/guards';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('doc-item')
export class DocItemController {
  constructor(private docItemService: DocItemService) {}

  @Get(':name')
  fetchAllDocItem(@Param() param: CategoryParamDTO, @Req() req: Request) {
    return this.docItemService.fetchDocItems(param, req.user);
  }
}
