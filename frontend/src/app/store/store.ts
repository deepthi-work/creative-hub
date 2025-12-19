import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';

@Component({
  selector: 'app-store',
  imports: [NgFor, FormsModule, Header],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {

  imageFolderPath = '/'; 
  allImages = [
    { name: 'clay house.jpg', category: 'Clay' },
    { name: 'crochet.jpg', category: 'Crochet' },
    { name: 'glass painting.jpg', category: 'Glass Paintings' },
    { name: 'jharokha.jpg', category: 'Jharokhas' },
    { name: 'lippan art.jpg', category: 'Lippan Art' },
    { name: 'painting.jpg', category: 'Canvases' },
    { name: 'resin art.jpg', category: 'Resin Art' },
  ];


  categories = ['All', 'Clay', 'Crochet', 'Glass Paintings', 'Jharokhas', 'Lippan Art', 'Canvases', 'Resin Art'];

  selectedCategory = 'All';
  filteredImages = this.allImages;

  sortOption = 'default';

  ngOnInit(): void { }

  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    this.filteredImages =
      cat === 'All'
        ? this.allImages
        : this.allImages.filter(img => img.category === cat);
  }

  sortImages() {
    if (this.sortOption === 'asc') {
      this.filteredImages = [...this.filteredImages].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (this.sortOption === 'desc') {
      this.filteredImages = [...this.filteredImages].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    } else {
      this.filterByCategory(this.selectedCategory); // reset
    }
  }

}
