import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IdParam, ViewByPage } from 'common/models';

import { NoteStatus } from './enums';
import { NoteExceptionFilter } from './exceptions/note-exception.filter';
import { NotesMapper } from './mappers';
import {
  NoteCreateModel,
  NotePatchModel,
  NoteQuery,
  NoteQueryByPage,
} from './models';
import { NotesService } from './notes.service';

@ApiTags('Note')
@Controller({
  path: 'notes',
  version: '1',
})
@UseFilters(NoteExceptionFilter)
export class NotesController {
  public constructor(
    private readonly notesService: NotesService,
    private readonly noteMapper: NotesMapper,
  ) {}

  @Get()
  public async array(@Query() query: NoteQuery) {
    const notes = await this.notesService.array(query);

    return notes.map(this.noteMapper.mapToShortView.bind(this));
  }

  @Get('list')
  public async list(@Query() query: NoteQueryByPage) {
    const [notes, total] = await this.notesService.list(query);

    return new ViewByPage(
      notes.map(this.noteMapper.mapToShortView.bind(this)),
      total,
    );
  }

  @Get('example-server-error')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async exampleServerError() {
    throw new Error('Example server error. For demonstration purposes only.');
  }

  @Get(':id')
  public async entity(@Param() { id }: IdParam) {
    const note = await this.notesService.getById(id);

    return this.noteMapper.mapToView(note);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body: NoteCreateModel) {
    const note = await this.notesService.create(body);

    return this.noteMapper.mapToView(note);
  }

  @Patch(':id')
  public async update(@Param() { id }: IdParam, @Body() body: NotePatchModel) {
    const note = await this.notesService.getById(id);
    await this.notesService.update(note, body);

    return this.noteMapper.mapToView(note);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param() { id }: IdParam) {
    await this.notesService.remove(id);

    return undefined;
  }

  @Post(':id/activate')
  public async activate(@Param() { id }: IdParam) {
    const note = await this.notesService.getById(id);

    await this.notesService.changeStatus(
      note,
      NoteStatus.active,
      [NoteStatus.inactive],
    );

    return this.noteMapper.mapToView(note);
  }

  @Post(':id/deactivate')
  public async deactivate(@Param() { id }: IdParam) {
    const note = await this.notesService.getById(id);

    await this.notesService.changeStatus(
      note,
      NoteStatus.inactive,
      [NoteStatus.active],
    );

    return this.noteMapper.mapToView(note);
  }

  @Get(':id/example-error')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async exampleError(@Param() { id }: IdParam) {
    await this.notesService.exampleError(id);
  }
}
