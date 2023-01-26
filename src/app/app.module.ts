import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EducationalObjectiveComponent } from './pieces/educational-objective/educational-objective.component';
import { RoleComponent } from './pieces/role/role.component';
import { MissionContextComponent } from './pieces/mission-context/mission-context.component';
import { GameEducationnalObjectiveComponent } from './pieces/game-educationnal-objective/game-educationnal-objective.component';
import { GameContextComponent } from './pieces/game-context/game-context.component';
import { TaskComponent } from './pieces/task/task.component';
import { AnnexeTaskComponent } from './pieces/annexe-task/annexe-task.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EducationalObjectiveComponent,
    RoleComponent,
    MissionContextComponent,
    GameEducationnalObjectiveComponent,
    GameContextComponent,
    TaskComponent,
    AnnexeTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
