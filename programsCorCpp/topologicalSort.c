#include <stdio.h>
#define MAX 20

int queue[MAX];
int front = -1, rear = -1;

void enqueue(int value){  queue[++rear] = value; }
int dequeue(){  return queue[++front]; }
int isEmpty(){ return front == rear; }

int main(){
    int n, i, j;
    int adj[MAX][MAX];

    int indegree[MAX] = {0};

    printf("Enter number of vertices: ");
    scanf("%d", &n);

    printf("Enter the adjacency matrix: \n");
    for(i = 0; i<n; i++){
        for(j=0; j<n; j++){
            scanf("%d", &adj[i][j]);
            if(adj[i][j] == 1){
                indegree[j]++;
            }
        }
    }

    for(i = 0; i<n; i++){
        if(indegree[i] == 0){
            enqueue(i);
        }
    }
    printf("Topological Sort: ");
    while(!isEmpty()){
        int vertex = dequeue();
        printf("%d ", vertex);
        for(i = 0; i<n; i++){
            if(adj[vertex][i] == 1){
                indegree[i]--;
                if(indegree[i] == 0){
                    enqueue(i);
                }
            }
        }
    }   

    return 0;
}


