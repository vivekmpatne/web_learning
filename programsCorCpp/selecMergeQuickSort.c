// here selection quick merge sort also practice

// common for for all ( time for selection , merge, quick sort)
#include <stdio.h>
#include <time.h>

// 1st selection sort

int main(){
    int n, i; 
    int arr[10000];
    
    clock_t start, end;
    double time_taken;

    printf("Enter the number of elements: ");
    scanf("%d", &n);

    printf("\nEnter the elements:  ");
    for(i = 0; i<n; i++){
        scanf("%d", &arr[i]);
    }

    start = clock();

    // here call function ( selectionSort(arr, n) , mergeSort(arr, 0, n-1), quickSort(arr, 0, n-1) )


    // end function 

    end = clock();

    time_taken = ((double)(end-start))/ CLOCKS_PER_SEC;


    // print the sorted array
    printf("\nSorted array: ");
    for(i = 0; i<n; i++){
        printf("%d ", arr[i]);
    }

    printf("\nTime taken: %f seconds\n", time_taken);

    return 0;

}