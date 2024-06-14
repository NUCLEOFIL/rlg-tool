import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RoleOccurrence } from 'src/app/class/role-occurrence/role-occurrence';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Trace } from 'src/app/class/trace/trace';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-role-occurence',
  templateUrl: './role-occurence.component.html',
  styleUrls: ['./role-occurence.component.scss']
})
export class RoleOccurenceComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() role: Role = new Role();

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService) { }

  ngOnInit(): void {
  }

  addOccurrence(): void {
    this.role.occurences.push(new RoleOccurrence());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'occurence_['+(this.role.occurences.length-1)+']','Role_['+this.pieceDetailsService.roleIndex+']','#E5C5AC'));
  }

  removeOccurrence(index: number): void {
    this.role.occurences.splice(index, 1);
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'occurence_['+(index)+']','Role_['+this.pieceDetailsService.roleIndex+']','#E5C5AC'));
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,'Role_['+this.pieceDetailsService.roleIndex+']', '#E5C5AC', undefined, event.target.value));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,'Role_['+this.pieceDetailsService.roleIndex+']', '#E5C5AC'));
    }
  }

}
