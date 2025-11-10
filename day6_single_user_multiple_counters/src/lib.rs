use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    example_mocks::solana_sdk::system_instruction,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    owner: Pubkey,
    count: u32,
    id: u8,
}

#[derive(BorshSerialize, BorshDeserialize)]
enum InstructionType {
    Initialize(u8),
    Increment(u8, u32),
    Decrement(u8, u32),
    Reset,
}

entrypoint!(counter_program);
pub fn counter_program(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut accounts_iter = accounts.iter();
    let payer = next_account_info(&mut accounts_iter)?;
    let counter_account = next_account_info(&mut accounts_iter)?;
    let sys_program_account = next_account_info(&mut accounts_iter)?;

    let instruction_type = InstructionType::try_from_slice(instruction_data)?;

    match instruction_type {
        InstructionType::Initialize(id) => {
            msg!("Initializing counter with id : {}", id);

            let (pda, bump) =
                Pubkey::find_program_address(&[b"counter", payer.key.as_ref(), &[id]], _program_id);

            if pda != *counter_account.key {
                msg!("Invalid PDA provided!!!!!");
                return Err(solana_program::program_error::ProgramError::InvalidSeeds);
            }

            let rent = Rent::get()?;
            let space = std::mem::size_of::<Counter>();
            let lamports = rent.minimum_balance(space);

            invoke_signed(
                &system_instruction::create_account(
                    payer.key,
                    counter_account.key,
                    lamports,
                    space as u64,
                    _program_id,
                ),
                &[
                    payer.clone(),
                    counter_account.clone(),
                    sys_program_account.clone(),
                ],
                &[&[b"counter", payer.key.as_ref(), &[id], &[bump]]],
            )?;

            let counter_data = Counter {
                count: 0,
                owner: *payer.key,
                id,
            };

            counter_data.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

            msg!("Counter created successfully for User: {}", payer.key);
        }
        InstructionType::Increment(id, value) => {
            msg!("Attempting to increment counter......");

            let (pda, _bump) =
                Pubkey::find_program_address(&[b"counter", payer.key.as_ref(), &[id]], _program_id);

            if !payer.is_signer {
                msg!("No payer signatures available!!!!!!");
                return Err(ProgramError::MissingRequiredSignature);
            }

            if pda != *counter_account.key {
                msg!("Invalid PDA provided!!!!!!");
                return Err(ProgramError::InvalidSeeds);
            }

            if counter_account.owner != _program_id {
                msg!("Incorrect ProgramId provided!!!!!!");
                return Err(ProgramError::IncorrectProgramId);
            }

            let mut counter_data = Counter::try_from_slice(&counter_account.data.borrow())?;

            let new_count = counter_data
                .count
                .checked_add(value)
                .ok_or(ProgramError::InvalidInstructionData)?;

            counter_data.count = new_count;

            counter_data.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;
            msg!("Counter incremented to: {}", counter_data.count);
        }
        InstructionType::Decrement(id, value) => {}
        InstructionType::Reset => {}
    }

    Ok(())
}
