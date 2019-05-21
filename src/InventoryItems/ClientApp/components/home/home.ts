import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface Collection {
    name: string;
    id: string;
}

@Component
export default class HomeComponent extends Vue {
    collections: Collection[] = [];

    mounted() {
        fetch('api/Collections/GetCollectionList')
            .then(response => response.json() as Promise<Collection[]>)
            .then(data => {
                this.collections = data;
            });
    };
}
