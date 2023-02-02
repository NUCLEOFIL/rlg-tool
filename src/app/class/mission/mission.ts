import { EducationnalObjective } from "../educationnal-objective/educationnal-objective";
import { MissionContext } from "../mission-context/mission-context";
import { Role } from "../role/role";

export class Mission {

    educationnalObjective: EducationnalObjective = new EducationnalObjective();
    context: MissionContext = new MissionContext();
    roles: Role[] = [new Role(), new Role()];

}
