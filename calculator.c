#include <stdio.h>

int main() {
    char operator;
    double first, second;
    
    printf("==================================\n");
    printf("       SIMPLE C CALCULATOR        \n");
    printf("==================================\n");
    printf("Enter an operator (+, -, *, /): ");
    scanf("%c", &operator);
    
    printf("Enter two operands: ");
    scanf("%lf %lf", &first, &second);
    
    switch (operator) {
        case '+':
            printf("%.2lf + %.2lf = %.2lf\n", first, second, first + second);
            break;
        case '-':
            printf("%.2lf - %.2lf = %.2lf\n", first, second, first - second);
            break;
        case '*':
            printf("%.2lf * %.2lf = %.2lf\n", first, second, first * second);
            break;
        case '/':
            if(second != 0.0)
                printf("%.2lf / %.2lf = %.2lf\n", first, second, first / second);
            else
                printf("Error! Division by zero is not allowed.\n");
            break;
        default:
            printf("Error! Operator is not correct\n");
    }
    
    return 0;
}
