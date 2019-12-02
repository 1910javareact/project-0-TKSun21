import { Reimbursement } from '../models/model-reimbursement'
import { ReimDTO } from '../dtos/reim-dto'

export function reimbursementDTOtoReimbursement(r: ReimDTO[]):Reimbursement{
    return new Reimbursement(
        r[0].reimbursementId,
        r[0].author,
        r[0].amount,
        r[0].dateSubmitted,
        r[0].dateResolved,
        r[0].description,
        r[0].resolver,
        r[0].status,
        r[0].type
    )
}

export function multiReimbursementDTOtoReimbursement(rD: ReimDTO[]):Reimbursement[]{
    let currentR: ReimDTO[] = []
    let result: Reimbursement[] = []
    for(let r of rD){
        if(currentR.length ===  0){
            currentR.push(r)
        }
        else if(currentR[0].reimbursementId === r.reimbursementId){
            currentR.push(r)
        }
        else{
            result.push(reimbursementDTOtoReimbursement(currentR))
            currentR = []
            currentR.push(r)
        }
    }
    result.push(reimbursementDTOtoReimbursement(currentR))
    return result
}