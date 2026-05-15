#include <stdio.h>
#include <stdlib.h>

int main(){

    int arr[10000];
    int n; 
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    //input 
    for(int i =0; i<n; i++){

        arr[i] = rand()%10000;
        // scanf("%d", &arr[i]);
    }
    // output
    for(int i=0; i<n; i++){
        printf("%d ", arr[i]);
    }
    
    return 0;
}
