import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reclamations } from 'src/app/models/ReclamationsM';
import { ReclamationsService } from 'src/app/services/reclamations/reclamations.service';

@Component({
  selector: 'app-edit-reclamations',
  templateUrl: './edit-reclamations.component.html',
  styleUrls: ['./edit-reclamations.component.css']
})
export class EditReclamationsComponent {
  id: number=0;
  recs: Reclamations = new Reclamations();
  status: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationsService
  ) { }


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    

    this.reclamationService.getReclamationId(this.id).subscribe(data=>{
      this.recs= data;
      console.log(this.recs);
    })
   
  }

  
  UpdateReclamation(): void {
   
    this.reclamationService.editReclamation(this.id, this.recs).subscribe(() => {
  
      this.router.navigate(['/reclamations/']);
    });
  }
}
