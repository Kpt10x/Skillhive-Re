import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scores',
  standalone: true,
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {
    getQueryParam(param: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    displayScore(): void {
        const score = this.getQueryParam('score');
        const scoreDisplayElement = document.querySelector('.container p');
        if (scoreDisplayElement) {
            scoreDisplayElement.textContent = `Your score is: ${score}`;
        }
    }

    ngOnInit(): void {
        this.displayScore();
    }
}
