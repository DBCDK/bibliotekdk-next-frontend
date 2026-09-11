-similar to v31 but with the following modifications:
--shuold not have all cql indexes. 
*like insted of both haveing creator, contributor and creatorcontributor, it should only have creatorcontributor.
*no need for issn or dk5

-it should do the following steps: 
1) use llm to convert prompt to ast format
2) use suggester search for creator, subject, title, etc.. choose fist item from the sugester always.
3) Then construct the cql and search

No need to check for count or anything as we always do the sugester thing
